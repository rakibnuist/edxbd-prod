import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'pdf-lib';

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

export interface PartnerProcessPackData {
  generatedDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
}

/**
 * Builds the downloadable "Partner Process Pack" PDF (Evidence-First Plan B2B Deliverable).
 * Contains:
 *   - Overview of EduExpress B2B Partnership Program
 *   - Written China USD Service Schedule (Type A $800, Type B $600, Type C $500, Pickup $150)
 *   - 6-Point SOP & Student Attribution / Non-Poaching Guarantee
 *   - Document Audit & Onboarding Timeline
 */
export async function buildPartnerProcessPackPdf(data: PartnerProcessPackData = {}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const petrolDark = rgb(0.04, 0.15, 0.24); // #0a2540
  const petrolHeading = rgb(0.06, 0.23, 0.36); // #0f3a5c
  const limeAccent = rgb(0.76, 0.95, 0.35); // #C2F159
  const textDark = rgb(0.12, 0.17, 0.21);
  const textMuted = rgb(0.38, 0.44, 0.48);
  const cardBg = rgb(0.96, 0.98, 0.99);
  const cardBorder = rgb(0.85, 0.89, 0.93);
  const white = rgb(1, 1, 1);
  const accentNavy = rgb(0.09, 0.31, 0.48);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Top header banner
  page.drawRectangle({
    x: 0,
    y: pageHeight - 110,
    width: pageWidth,
    height: 110,
    color: petrolDark,
  });

  page.drawText('EduExpress International', {
    x: margin,
    y: pageHeight - 42,
    size: 20,
    font: fontBold,
    color: white,
  });

  page.drawText('B2B AGENCY PARTNERSHIP PROCESS PACK · 2026/2027', {
    x: margin,
    y: pageHeight - 62,
    size: 9,
    font: fontBold,
    color: limeAccent,
  });

  page.drawText('Official Commercial Schedule, Non-Poaching Safeguards & Processing SOP', {
    x: margin,
    y: pageHeight - 82,
    size: 10,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.94),
  });

  let cursorY = pageHeight - 140;

  // Overview box
  page.drawRectangle({
    x: margin,
    y: cursorY - 60,
    width: contentWidth,
    height: 60,
    color: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
  });

  page.drawText('PROGRAM OVERVIEW & PRINCIPLES', {
    x: margin + 14,
    y: cursorY - 18,
    size: 9,
    font: fontBold,
    color: petrolHeading,
  });

  const introText = 'EduExpress International partners with regional education consultancies, B2B desks, and sub-agents across Bangladesh. We operate with strict client attribution, written commercial schedules in USD, and timestamped university portal tracking.';
  const introLines = wrapText(introText, fontRegular, 8.5, contentWidth - 28);
  let introY = cursorY - 32;
  for (const line of introLines) {
    page.drawText(line, { x: margin + 14, y: introY, size: 8.5, font: fontRegular, color: textDark });
    introY -= 12;
  }

  cursorY -= 82;

  // China USD Schedule Table
  page.drawText('1. PUBLISHED CHINA B2B SERVICE CHARGE SCHEDULE', {
    x: margin,
    y: cursorY,
    size: 11,
    font: fontBold,
    color: petrolHeading,
  });
  cursorY -= 16;

  const tiers = [
    { type: 'Type-A', title: 'Full Funded Scholarship', price: '$800 USD', desc: 'Full tuition, accommodation & stipend award routes. 24–48h profile audit & portal follow-up.' },
    { type: 'Type-B', title: '100% Tuition Fee Free', price: '$600 USD', desc: 'Full tuition waiver routes. Separate hostel & living costs clearly itemised in advance.' },
    { type: 'Type-C', title: 'Partial Scholarship / Waiver', price: '$500 USD', desc: 'Partial tuition reduction confirmed on admission notice. ClearCost itemised estimate.' },
    { type: 'Add-On', title: 'Airport Pickup & Handover (Optional)', price: '$150 USD', desc: 'Direct arrival reception, airport pickup, and campus dormitory check-in handover.' },
  ];

  for (const tier of tiers) {
    page.drawRectangle({
      x: margin,
      y: cursorY - 44,
      width: contentWidth,
      height: 44,
      color: white,
      borderColor: cardBorder,
      borderWidth: 1,
    });

    // Badge
    page.drawRectangle({
      x: margin + 10,
      y: cursorY - 32,
      width: 58,
      height: 18,
      color: tier.type === 'Type-A' ? petrolDark : cardBg,
    });
    page.drawText(tier.type, {
      x: margin + 14,
      y: cursorY - 26,
      size: 8,
      font: fontBold,
      color: tier.type === 'Type-A' ? limeAccent : petrolHeading,
    });

    page.drawText(tier.title, {
      x: margin + 76,
      y: cursorY - 24,
      size: 9.5,
      font: fontBold,
      color: petrolHeading,
    });

    page.drawText(tier.price, {
      x: margin + contentWidth - 85,
      y: cursorY - 24,
      size: 11,
      font: fontBold,
      color: accentNavy,
    });

    page.drawText(tier.desc, {
      x: margin + 76,
      y: cursorY - 38,
      size: 8,
      font: fontRegular,
      color: textMuted,
    });

    cursorY -= 50;
  }

  cursorY -= 10;

  // Safeguards & Non-Poaching
  page.drawText('2. WRITTEN NON-POACHING & STUDENT FILE SAFEGUARDS', {
    x: margin,
    y: cursorY,
    size: 11,
    font: fontBold,
    color: petrolHeading,
  });
  cursorY -= 16;

  const safeguards = [
    { title: 'Strict File Attribution:', body: 'Every submitted applicant remains attributed exclusively to your partner code. We never contact your student directly without written consent.' },
    { title: 'Itemised Third-Party Expenses:', body: 'University application deposits, embassy visa fees, medical tests, and courier fees are listed separately with zero hidden markups.' },
    { title: 'Bilateral MOU Agreement:', body: 'Territory scope, settlement milestones, and data privacy safeguards are locked in a signed legal memorandum before files proceed.' },
  ];

  for (const s of safeguards) {
    page.drawText(`• ${s.title}`, { x: margin + 6, y: cursorY, size: 8.5, font: fontBold, color: petrolHeading });
    const sLines = wrapText(s.body, fontRegular, 8.5, contentWidth - 24);
    cursorY -= 12;
    for (const line of sLines) {
      page.drawText(line, { x: margin + 16, y: cursorY, size: 8.5, font: fontRegular, color: textDark });
      cursorY -= 12;
    }
    cursorY -= 4;
  }

  cursorY -= 10;

  // Onboarding Timeline
  page.drawText('3. ONBOARDING & PROCESSING WORKFLOW', {
    x: margin,
    y: cursorY,
    size: 11,
    font: fontBold,
    color: petrolHeading,
  });
  cursorY -= 16;

  const stepsList = [
    'Step 1 (Profile & MOU): Submit agency profile at eduexpressint.com/partnership. Bilateral MOU executed within 2–3 business days.',
    'Step 2 (Dossier Review): File submission via B2B portal. Initial academic screening and gap audit completed within 24–48 hours.',
    'Step 3 (Portal Tracking): Application tracking code provided. Receive JW202 / eVAL and visa notice updates at every milestone.',
  ];

  for (const step of stepsList) {
    const lines = wrapText(step, fontRegular, 8.5, contentWidth - 12);
    for (const line of lines) {
      page.drawText(line, { x: margin + 6, y: cursorY, size: 8.5, font: fontRegular, color: textDark });
      cursorY -= 12;
    }
    cursorY -= 3;
  }

  // Footer banner
  page.drawRectangle({
    x: margin,
    y: 35,
    width: contentWidth,
    height: 48,
    color: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
  });

  page.drawText('EduExpress International B2B Desk · Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209', {
    x: margin + 12,
    y: 65,
    size: 7.5,
    font: fontBold,
    color: petrolHeading,
  });

  page.drawText('Phone: +880 1983-333566 · Email: partner@eduexpressint.com · Web: eduexpressint.com/partnership', {
    x: margin + 12,
    y: 48,
    size: 7.5,
    font: fontRegular,
    color: textMuted,
  });

  return await pdfDoc.save();
}

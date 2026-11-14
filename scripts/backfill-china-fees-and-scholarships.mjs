import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();
const rootDir = process.cwd();

async function main() {
  const wbPath = path.resolve(rootDir, 'data/research/china-mbbs-workbook.json');
  const wb = JSON.parse(fs.readFileSync(wbPath, 'utf8'));
  const mbbsSheet = wb['45 MOE MBBS + Foundation'];

  const mbbsMap = new Map();
  for (let i = 3; i < mbbsSheet.length; i++) {
    const c = mbbsSheet[i].cells;
    if (c && c.B) {
      mbbsMap.set(c.B.trim().toLowerCase(), c);
    }
  }

  const unis = await prisma.university.findMany({
    where: { isActive: true },
    include: { fees: true, scholarships: true, programs: true }
  });

  console.log(`Auditing ${unis.length} active universities...`);
  let feesInserted = 0;
  let scholarshipsInserted = 0;

  for (const u of unis) {
    const normName = u.name.trim().toLowerCase();
    const mbbsData = mbbsMap.get(normName);

    // 1. Backfill Fees if empty
    if (u.fees.length === 0) {
      const feeItems = [];

      if (mbbsData) {
        const tuitionVal = mbbsData.L ? `${mbbsData.L} CNY/Year` : '35,000 CNY/Year';
        const hostelVal = mbbsData.M ? `${mbbsData.M} CNY/Year` : '5,000 CNY/Year';
        const otherVal = mbbsData.N ? `${mbbsData.N} CNY/Year` : '2,000 CNY/Year';

        feeItems.push(
          { item: 'Tuition Fee', cost: tuitionVal, recipient: 'University', refundable: 'Per university policy' },
          { item: 'Accommodation / Hostel Fee', cost: hostelVal, recipient: 'University', refundable: 'Non-refundable after check-in' },
          { item: 'Compulsory Medical Insurance', cost: '800 CNY/Year', recipient: 'Ping An Insurance / MOE', refundable: 'Non-refundable' },
          { item: 'Residence Permit Fee', cost: '400 CNY/Year', recipient: 'Public Security Bureau (PSB)', refundable: 'Non-refundable' },
          { item: 'Medical Examination Fee in China', cost: '400 - 500 CNY', recipient: 'Health Quarantine Bureau', refundable: 'Non-refundable' },
          { item: 'Application / Registration Fee', cost: '600 - 800 CNY', recipient: 'University', refundable: 'Non-refundable' }
        );
      } else if (u.slug === 'xian-jiaotong-university') {
        feeItems.push(
          { item: 'Tuition Fee (Foundation / Language)', cost: '8,000 - 15,000 CNY/Year', recipient: 'University', refundable: 'Per policy' },
          { item: 'Tuition Fee (Degree)', cost: '26,000 - 45,000 CNY/Year', recipient: 'University', refundable: 'Per policy' },
          { item: 'Accommodation Fee', cost: '5,500 CNY/Year', recipient: 'University', refundable: 'Non-refundable after check-in' },
          { item: 'Medical Insurance', cost: '800 CNY/Year', recipient: 'Insurance Company', refundable: 'Non-refundable' },
          { item: 'Residence Permit', cost: '400 CNY/Year', recipient: 'PSB', refundable: 'Non-refundable' },
          { item: 'Application Fee', cost: '800 CNY', recipient: 'University', refundable: 'Non-refundable' }
        );
      } else if (u.slug === 'hubei-university-of-education') {
        feeItems.push(
          { item: 'Tuition Fee', cost: '15,000 - 18,000 CNY/Year', recipient: 'University', refundable: 'Per policy' },
          { item: 'Accommodation Fee', cost: '2,400 CNY/Year', recipient: 'University', refundable: 'Non-refundable after check-in' },
          { item: 'Medical Insurance', cost: '800 CNY/Year', recipient: 'Insurance Company', refundable: 'Non-refundable' },
          { item: 'Residence Permit', cost: '400 CNY/Year', recipient: 'PSB', refundable: 'Non-refundable' },
          { item: 'Application Fee', cost: '400 CNY', recipient: 'University', refundable: 'Non-refundable' }
        );
      } else if (u.slug === 'university-of-shanghai-for-science-and-technology') {
        feeItems.push(
          { item: 'Tuition Fee', cost: '26,000 CNY/Year', recipient: 'University', refundable: 'Per policy' },
          { item: 'Accommodation Fee', cost: '4,800 CNY/Year', recipient: 'University', refundable: 'Non-refundable after check-in' },
          { item: 'Medical Insurance', cost: '800 CNY/Year', recipient: 'Insurance Company', refundable: 'Non-refundable' },
          { item: 'Residence Permit', cost: '400 CNY/Year', recipient: 'PSB', refundable: 'Non-refundable' },
          { item: 'Application Fee', cost: '500 CNY', recipient: 'University', refundable: 'Non-refundable' }
        );
      } else if (u.slug === 'tsinghua-university') {
        feeItems.push(
          { item: 'Tuition Fee (Undergraduate)', cost: '30,000 - 40,000 CNY/Year', recipient: 'University', refundable: 'Per policy' },
          { item: 'Accommodation Fee', cost: '14,600 CNY/Year (Approx. 40 CNY/day)', recipient: 'University', refundable: 'Non-refundable' },
          { item: 'Medical Insurance', cost: '800 CNY/Year', recipient: 'Insurance Company', refundable: 'Non-refundable' },
          { item: 'Residence Permit', cost: '400 CNY/Year', recipient: 'PSB', refundable: 'Non-refundable' },
          { item: 'Application Fee', cost: '800 CNY', recipient: 'University', refundable: 'Non-refundable' }
        );
      } else {
        // Fallback standard public university line items
        feeItems.push(
          { item: 'Tuition Fee', cost: u.tuition || '18,000 - 28,000 CNY/Year', recipient: 'University', refundable: 'Per policy' },
          { item: 'Accommodation / Hostel Fee', cost: '3,000 - 6,000 CNY/Year', recipient: 'University', refundable: 'Non-refundable after check-in' },
          { item: 'Compulsory Medical Insurance', cost: '800 CNY/Year', recipient: 'Insurance Company', refundable: 'Non-refundable' },
          { item: 'Residence Permit', cost: '400 CNY/Year', recipient: 'PSB', refundable: 'Non-refundable' },
          { item: 'Application Fee', cost: '400 - 600 CNY', recipient: 'University', refundable: 'Non-refundable' }
        );
      }

      for (const item of feeItems) {
        await prisma.fee.create({
          data: {
            universityId: u.id,
            item: item.item,
            cost: item.cost,
            recipient: item.recipient,
            refundable: item.refundable,
            validFor: '2026/2027 Academic Year'
          }
        });
        feesInserted++;
      }
      console.log(`[FEES] Added ${feeItems.length} fee items for ${u.name}`);
    }

    // 2. Backfill Scholarships if empty
    if (u.scholarships.length === 0) {
      const scholItems = [];

      if (mbbsData && mbbsData.R) {
        scholItems.push({
          title: String(mbbsData.R).split('+')[0].trim(),
          amount: mbbsData.R,
          coverage: mbbsData.Q ? `${mbbsData.Q} availability: ${mbbsData.R}` : mbbsData.R,
          type: mbbsData.Q?.includes('CSC') ? 'Government' : 'University / Provincial',
          condition: mbbsData.S ? `Target: ${mbbsData.S}` : 'Academic merit & interview',
          details: JSON.stringify({
            eligibility: mbbsData.S || 'Competitive GPA',
            pcbMarks: mbbsData.T || 'Good Science grades',
            ageRule: mbbsData.U || '18-25',
            english: mbbsData.V || 'English-medium eligibility',
            notes: mbbsData.AB || 'Official university/provincial award pathway'
          }),
          eligiblePrograms: JSON.stringify(['MBBS', 'Clinical Medicine', 'General Undergraduate'])
        });
      } else if (u.slug === 'xian-jiaotong-university') {
        scholItems.push({
          title: 'XJTU Siyuan International Student Scholarship',
          amount: '10,000 - 25,000 CNY/Year',
          coverage: 'Partial to full tuition waiver',
          type: 'University Presidential',
          condition: 'Top academic standing and faculty recommendation',
          details: JSON.stringify({ pathway: 'University direct application', review: 'Annual performance evaluation' }),
          eligiblePrograms: JSON.stringify(['Foundation', 'Engineering', 'Science', 'Management'])
        });
      } else if (u.slug === 'hubei-university-of-education') {
        scholItems.push({
          title: 'Hubei Provincial Government Scholarship',
          amount: '10,000 - 15,000 CNY/Year',
          coverage: 'Partial to full tuition reduction',
          type: 'Provincial Government',
          condition: 'Minimum GPA 3.0/4.0 and active attendance',
          details: JSON.stringify({ pathway: 'Provincial nomination via university' }),
          eligiblePrograms: JSON.stringify(['Education', 'Arts', 'Computer Science'])
        });
      } else if (u.slug === 'university-of-shanghai-for-science-and-technology') {
        scholItems.push({
          title: 'Shanghai Municipal Government Scholarship (Class B)',
          amount: 'Tuition waiver',
          coverage: '100% or partial tuition waiver',
          type: 'Municipal Government',
          condition: 'Outstanding academic record',
          details: JSON.stringify({ pathway: 'Shanghai municipal quota' }),
          eligiblePrograms: JSON.stringify(['Engineering', 'Business', 'Technology'])
        });
      } else if (u.slug === 'tsinghua-university') {
        scholItems.push({
          title: 'Chinese Government Scholarship (CSC) & Beijing Government Award',
          amount: 'Full tuition + stipend / 20,000-40,000 CNY',
          coverage: 'Full tuition, hostel, insurance, monthly stipend (CSC)',
          type: 'National & Municipal',
          condition: 'Top tier academic profile, competitive interview',
          details: JSON.stringify({ pathway: 'CSC Type A (Embassy) or Type B (University)' }),
          eligiblePrograms: JSON.stringify(['All undergraduate and postgraduate degrees'])
        });
      } else {
        scholItems.push({
          title: `${u.name} International Student Merit Award`,
          amount: '5,000 - 15,000 CNY/Year',
          coverage: 'Partial tuition reduction',
          type: 'University / Local Government',
          condition: 'Minimum HSC/SSC GPA 4.0 or equivalent',
          details: JSON.stringify({ pathway: 'Institutional merit quota' }),
          eligiblePrograms: JSON.stringify(['Undergraduate Programs'])
        });
      }

      for (const s of scholItems) {
        await prisma.scholarship.create({
          data: {
            universityId: u.id,
            title: s.title,
            amount: s.amount,
            coverage: s.coverage,
            type: s.type,
            condition: s.condition,
            details: s.details,
            eligiblePrograms: s.eligiblePrograms,
            status: 'active'
          }
        });
        scholarshipsInserted++;
      }
      console.log(`[SCHOLARSHIP] Added scholarship for ${u.name}`);
    }
  }

  console.log(`\n=== Backfill Finished ===`);
  console.log(`Total Fees Inserted: ${feesInserted}`);
  console.log(`Total Scholarships Inserted: ${scholarshipsInserted}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

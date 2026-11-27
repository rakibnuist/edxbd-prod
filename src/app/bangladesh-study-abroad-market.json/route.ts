import { NextResponse } from 'next/server';
import { getPublishedStories } from '@/app/success-stories/stories';
import {
  BANGLADESH_MACRO_INDICATORS,
  BANGLADESH_MARKET_LAST_VERIFIED_ISO,
  BANGLADESH_MARKET_SOURCES,
  STUDENT_FILE_COMPARISON,
  buildBangladeshMarketBenchmark,
} from '@/lib/bangladesh-market-benchmark';
import { getChinaIntakes } from '@/lib/china-intakes';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

/**
 * Machine-readable Bangladesh Study Abroad Market benchmark dataset referenced by
 * /bangladesh-study-abroad-market (`Dataset` schema `DataDownload`), /llms.txt,
 * and /llms-full.txt.
 */
export async function GET() {
  const now = new Date();
  const [universities, stories] = await Promise.all([
    getUniversityRecords(),
    getPublishedStories().catch(() => []),
  ]);
  const snapshot = buildBangladeshMarketBenchmark(universities, stories.length, now, getChinaIntakes(now));

  return NextResponse.json(
    {
      title: 'Bangladesh Study Abroad Market Benchmark & 32-Country Global Destination Matrix 2027',
      url: 'https://eduexpressint.com/bangladesh-study-abroad-market',
      bengaliUrl: 'https://eduexpressint.com/bn/bangladesh-study-abroad-market',
      datasetUrl: 'https://eduexpressint.com/bangladesh-study-abroad-market.json',
      publisher: {
        name: 'EduExpress International',
        url: 'https://eduexpressint.com',
        officeName: DEFAULT_OFFICE_RECORD.name,
        address: DEFAULT_OFFICE_RECORD.address,
        hours: DEFAULT_OFFICE_RECORD.hours,
        phonePrimary: DEFAULT_OFFICE_RECORD.phonePrimary,
        phoneSecondary: DEFAULT_OFFICE_RECORD.phoneSecondary,
        email: DEFAULT_OFFICE_RECORD.email,
      },
      generatedAt: now.toISOString(),
      lastVerified: BANGLADESH_MARKET_LAST_VERIFIED_ISO,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      methodology: {
        tuitionAndLivingSeparated: true,
        sourceGovernance: '2-tier-hybrid (high-level public authorities exposed; granular update-tracking URLs retained privately for automated change monitoring)',
        chinaVisaFirstPolicy:
          'No file opening charge. No EduExpress service fee before China visa approval (BDT 200,000 complete package after visa). Earlier third-party fees must be itemized in writing.',
        malaysiaServiceFee: 'BDT 0 EduExpress service fee; EMGS, tuition, and travel are paid directly by the student.',
        ukServiceFee: 'BDT 0 EduExpress service fee; CAS deposit, UKVI visa fee, IHS, and IOM TB test are paid directly by the student.',
        europeServiceFee: 'BDT 0 file-opening charge; BDT 100,000 (1 Lakh Taka) service fee for other European destinations (Hungary, Finland, Malta, Cyprus, Georgia, Greece, Croatia) payable 100% after visa approval.',
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      snapshot,
      macroMarketFundamentals: BANGLADESH_MACRO_INDICATORS,
      studentFileVsChinaPayment: STUDENT_FILE_COMPARISON,
      academicPathways: [
        {
          stage: 'After O-Level / SSC / Dakhil',
          routes: [
            'Malaysia 1-Year Foundation + 3-Year Bachelor (4 years total)',
            'China 3-Year Higher Vocational Diploma + 2-Year Top-Up Bachelor (5 years total)',
          ],
          englishGuide: 'https://eduexpressint.com/study-in-malaysia-after-o-level',
          chinaGuide: 'https://eduexpressint.com/study-in-china-after-o-level-ssc',
          bengaliGuide: 'https://eduexpressint.com/bn/study-in-china-after-ssc-dakhil',
        },
        {
          stage: 'After A-Level / HSC / Alim',
          routes: [
            'China Ranked Bachelor (University/Provincial scholarships + CSCA prep)',
            'Malaysia UK/Australian Branch Campuses & Dual Degrees',
            'United Kingdom 3-Year Honours (Jan 2027 18-month Graduate Route rule)',
            'Hungary (Stipendium Hungaricum), South Korea (GKS), Finland (UAS/Research), Georgia (MBBS)',
          ],
          comparisonGuide: 'https://eduexpressint.com/bangladesh-vs-study-abroad-countries',
        },
        {
          stage: 'B2B Agency & Sub-Agent Desk',
          routes: [
            'China, Malaysia, and 10 active destinations under custom bilateral MOU',
            '24-48h file audits, non-poaching attribution protection, and 5-stage SOP',
          ],
          b2bDeskUrl: 'https://eduexpressint.com/b2b',
          globalPartnerUrl: 'https://eduexpressint.com/partnership',
        },
      ],
      officialSources: BANGLADESH_MARKET_SOURCES,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    },
  );
}

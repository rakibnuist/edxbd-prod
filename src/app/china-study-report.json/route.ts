import { NextResponse } from 'next/server';
import { getPublishedStories } from '@/app/success-stories/stories';
import { buildChinaBenchmark, CHINA_REPORT_OFFICIAL_AUTHORITIES } from '@/lib/china-benchmark';
import { CHINA_INTAKE_VERIFIED_ON, getChinaIntakes } from '@/lib/china-intakes';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

/**
 * Machine-readable Bangladesh-to-China live benchmark dataset referenced by
 * /china-study-report-bangladesh (`Dataset` schema `DataDownload`) and /llms.txt.
 */
export async function GET() {
  const now = new Date();
  const [universities, stories] = await Promise.all([
    getUniversityRecords('China'),
    getPublishedStories({ country: { contains: 'China' } }),
  ]);
  const intakes = getChinaIntakes(now);
  const report = buildChinaBenchmark(universities, intakes, stories.length, now);

  return NextResponse.json(
    {
      title: 'Bangladesh to China Study Data & Cost Benchmark Report',
      url: 'https://eduexpressint.com/china-study-report-bangladesh',
      datasetUrl: 'https://eduexpressint.com/china-study-report.json',
      publisher: {
        name: 'EduExpress International',
        url: 'https://eduexpressint.com',
        officeName: DEFAULT_OFFICE_RECORD.name,
        address: DEFAULT_OFFICE_RECORD.address,
        hours: DEFAULT_OFFICE_RECORD.hours,
        phonePrimary: DEFAULT_OFFICE_RECORD.phonePrimary,
        email: DEFAULT_OFFICE_RECORD.email,
      },
      generatedAt: now.toISOString(),
      intakeVerifiedOn: CHINA_INTAKE_VERIFIED_ON,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      methodology: {
        tuitionCurrency: 'CNY',
        servicePackageCurrency: 'BDT',
        explicitSingleYearCnyOnly: true,
        noSyntheticFxConversion: true,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        chinaVisaFirstPolicy:
          'No file opening charge. No EduExpress service fee before China visa approval. Earlier third-party fees must be itemized in writing.',
      },
      report,
      officialSources: CHINA_REPORT_OFFICIAL_AUTHORITIES,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    },
  );
}

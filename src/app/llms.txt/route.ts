export function GET() {
  const content = `# EduExpress International — Evidence-First Overseas Education
> Official portal for Bangladeshi students seeking verified university admissions, clear cost schedules, and visa guidance.

## Core Services & Verification Standard
- Better Education Standard: https://eduexpressint.com/better-education-standard
- Fees & Transparency: https://eduexpressint.com/fees-and-transparency
- China Visa-First Policy: https://eduexpressint.com/china-visa-first-policy
- Free Education Fit Assessment: https://eduexpressint.com/education-fit-assessment

## Active Destination Services
- Study in China (Flagship): https://eduexpressint.com/study-in-china-from-bangladesh
- Study in United Kingdom: https://eduexpressint.com/destinations/uk
- Study in Hungary: https://eduexpressint.com/destinations/hungary
- Study in South Korea: https://eduexpressint.com/destinations/south-korea
- Study in Finland: https://eduexpressint.com/destinations/finland
- Study in Malaysia: https://eduexpressint.com/destinations/malaysia
- Study in Malta: https://eduexpressint.com/destinations/malta
- Study in Cyprus: https://eduexpressint.com/destinations/cyprus
- Study in Georgia (MBBS & General): https://eduexpressint.com/destinations/georgia
- Study in Greece: https://eduexpressint.com/destinations/greece
- Study in Croatia: https://eduexpressint.com/destinations/croatia
- Study in Thailand: https://eduexpressint.com/destinations/thailand

## Head Office & Location
- Address: House 12/1, Ground Floor, Road 4/A, Dhanmondi, Dhaka 1209, Bangladesh
- Contact: +880 1983-333566 | +880 1329-663505
- Website: https://eduexpressint.com
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

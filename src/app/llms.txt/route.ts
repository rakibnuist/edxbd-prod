export function GET() {
  const content = `# EduExpress International — Evidence-First Overseas Education
> Official portal for Bangladeshi students seeking verified university admissions, clear cost schedules, and visa guidance.

## Core Services & Verification Standard
- Find Education: https://eduexpressint.com/find-education
- Complete Study Journey: https://eduexpressint.com/your-study-journey
- Scholarship Guidance: https://eduexpressint.com/scholarships
- Better Education Standard: https://eduexpressint.com/better-education-standard
- Fees & Transparency: https://eduexpressint.com/fees-and-transparency
- China Visa-First Policy: https://eduexpressint.com/china-visa-first-policy
- Free Education Fit Assessment: https://eduexpressint.com/education-fit-assessment

## Updates, Guides & RSS
- Advice and updates library (news + verified guides): https://eduexpressint.com/updates
- Topic archives: https://eduexpressint.com/updates/category/announcement (one archive per category)
- Everything as an RSS feed: https://eduexpressint.com/updates/feed.xml
- 2027 intake deadlines & status: https://eduexpressint.com/china-intakes-deadlines

## Public Destination Services
- Study in China (Flagship): https://eduexpressint.com/study-in-china-from-bangladesh
- All 12 listed destination services are open: https://eduexpressint.com/destinations
- United Kingdom: https://eduexpressint.com/study-in-uk-from-bangladesh
- Hungary: https://eduexpressint.com/study-in-hungary-from-bangladesh
- South Korea: https://eduexpressint.com/study-in-south-korea-from-bangladesh
- Finland: https://eduexpressint.com/study-in-finland-from-bangladesh
- Malaysia: https://eduexpressint.com/study-in-malaysia-from-bangladesh
- Malta: https://eduexpressint.com/study-in-malta-from-bangladesh
- Cyprus: https://eduexpressint.com/study-in-cyprus-from-bangladesh
- Georgia: https://eduexpressint.com/study-in-georgia-from-bangladesh
- Greece: https://eduexpressint.com/study-in-greece-from-bangladesh
- Croatia: https://eduexpressint.com/study-in-croatia-from-bangladesh
- Thailand: https://eduexpressint.com/study-in-thailand-from-bangladesh

## Head Office & Location
- Address: Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209
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

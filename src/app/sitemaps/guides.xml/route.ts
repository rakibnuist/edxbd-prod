import { evidencePages } from '@/data/evidencePages';
import { sitemapResponse } from '@/lib/sitemap-xml';

const guideSlugs = ['china-universities', 'china-scholarships-bangladesh', 'china-student-visa-bangladesh', 'study-in-china-cost-bangladesh', 'study-in-china-without-ielts', 'mbbs-in-china-bangladesh', 'china-intakes-deadlines', 'life-in-china-bangladeshi-students', 'china-visa-first-policy'];

export function GET() {
  return sitemapResponse(guideSlugs.filter((slug) => evidencePages[slug]).map((slug) => ({ loc: `https://eduexpressint.com/${slug}`, lastmod: evidencePages[slug].reviewedAt })));
}

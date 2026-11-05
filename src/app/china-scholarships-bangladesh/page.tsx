import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { ogImage, pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['china-scholarships-bangladesh'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/china-scholarships-bangladesh', image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing') });

export default function ChinaScholarshipsPage() {
  return <ChinaGuidePage guide={guide} />;
}

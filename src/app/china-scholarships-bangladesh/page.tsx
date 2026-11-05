import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['china-scholarships-bangladesh'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/china-scholarships-bangladesh' });

export default function ChinaScholarshipsPage() {
  return <ChinaGuidePage guide={guide} />;
}

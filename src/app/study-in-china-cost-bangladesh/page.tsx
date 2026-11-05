import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['study-in-china-cost-bangladesh'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/study-in-china-cost-bangladesh' });

export default function ChinaCostGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['life-in-china-bangladeshi-students'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/life-in-china-bangladeshi-students' });

export default function ChinaLifeGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

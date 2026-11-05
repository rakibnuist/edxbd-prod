import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { ogImage, pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['life-in-china-bangladeshi-students'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/life-in-china-bangladeshi-students', image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing') });

export default function ChinaLifeGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

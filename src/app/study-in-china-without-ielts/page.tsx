import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { ogImage, pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['study-in-china-without-ielts'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/study-in-china-without-ielts', image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing') });

export default function ChinaLanguageGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

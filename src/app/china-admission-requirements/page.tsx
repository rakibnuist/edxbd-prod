import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { ogImage, pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['china-admission-requirements'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/china-admission-requirements', image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing') });

export default function ChinaAdmissionGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

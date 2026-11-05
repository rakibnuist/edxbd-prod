import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['china-admission-requirements'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/china-admission-requirements' });

export default function ChinaAdmissionGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

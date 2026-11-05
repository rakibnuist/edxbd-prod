import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['china-student-visa-bangladesh'];

export const metadata = pageMetadata({ title: guide.metaTitle, description: guide.description, path: '/china-student-visa-bangladesh' });

export default function ChinaVisaGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

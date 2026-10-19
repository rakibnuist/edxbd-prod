import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages, chinaGuideMetadata } from '@/data/chinaGuidePages';

export const metadata = chinaGuideMetadata('study-in-china-without-ielts');

export default function ChinaLanguageGuidePage() {
  return <ChinaGuidePage guide={chinaGuidePages['study-in-china-without-ielts']} />;
}

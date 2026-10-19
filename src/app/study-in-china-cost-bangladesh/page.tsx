import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages, chinaGuideMetadata } from '@/data/chinaGuidePages';

export const metadata = chinaGuideMetadata('study-in-china-cost-bangladesh');

export default function ChinaCostGuidePage() {
  return <ChinaGuidePage guide={chinaGuidePages['study-in-china-cost-bangladesh']} />;
}

import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages, chinaGuideMetadata } from '@/data/chinaGuidePages';

export const metadata = chinaGuideMetadata('life-in-china-bangladeshi-students');

export default function ChinaLifeGuidePage() {
  return <ChinaGuidePage guide={chinaGuidePages['life-in-china-bangladeshi-students']} />;
}

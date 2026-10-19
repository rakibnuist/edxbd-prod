import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages, chinaGuideMetadata } from '@/data/chinaGuidePages';

export const metadata = chinaGuideMetadata('china-student-visa-bangladesh');

export default function ChinaVisaGuidePage() {
  return <ChinaGuidePage guide={chinaGuidePages['china-student-visa-bangladesh']} />;
}

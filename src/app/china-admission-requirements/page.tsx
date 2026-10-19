import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages, chinaGuideMetadata } from '@/data/chinaGuidePages';

export const metadata = chinaGuideMetadata('china-admission-requirements');

export default function ChinaAdmissionGuidePage() {
  return <ChinaGuidePage guide={chinaGuidePages['china-admission-requirements']} />;
}

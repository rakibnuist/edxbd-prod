import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages, chinaGuideMetadata } from '@/data/chinaGuidePages';

export const metadata = chinaGuideMetadata('china-scholarships-bangladesh');

export default function ChinaScholarshipsPage() {
  return <ChinaGuidePage guide={chinaGuidePages['china-scholarships-bangladesh']} />;
}

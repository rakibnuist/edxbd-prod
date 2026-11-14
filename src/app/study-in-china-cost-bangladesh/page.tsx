import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { ogImage, pageMetadata } from '@/lib/seo';

const guide = chinaGuidePages['study-in-china-cost-bangladesh'];

export const metadata = pageMetadata({
  title: guide.metaTitle,
  description: guide.description,
  path: '/study-in-china-cost-bangladesh',
  image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
  languages: {
    'en-BD': '/study-in-china-cost-bangladesh',
    'bn-BD': '/bn/study-in-china-cost-bangladesh',
    'x-default': '/study-in-china-cost-bangladesh',
  },
});

export default function ChinaCostGuidePage() {
  return <ChinaGuidePage guide={guide} />;
}

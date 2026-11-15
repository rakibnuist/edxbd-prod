import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/page/PageKit';

export interface BnChinaGuideLink {
  label: string;
  href: string;
  lang: 'bn' | 'en';
}

export const BN_CHINA_GUIDE_LINKS: readonly BnChinaGuideLink[] = [
  { label: 'চীনে উচ্চশিক্ষা মূল গাইড (বাংলা)', href: '/bn/study-in-china', lang: 'bn' },
  { label: 'চীনে পড়াশোনার মোট খরচ (বাংলা)', href: '/bn/study-in-china-cost-bangladesh', lang: 'bn' },
  { label: 'CSC স্কলারশিপ সম্পূর্ণ গাইড (বাংলা)', href: '/bn/csc-scholarship-bangladesh', lang: 'bn' },
  { label: 'চায়না স্টুডেন্ট ভিসা গাইড (বাংলা)', href: '/bn/china-student-visa-bangladesh', lang: 'bn' },
  { label: 'চীনে MBBS ভর্তি ও BMDC গাইড (বাংলা)', href: '/bn/mbbs-in-china-bangladesh', lang: 'bn' },
  { label: 'মার্চ ২০২৭ স্প্রিং ইনটেক গাইড', href: '/china-march-2027-intake', lang: 'en' },
  { label: 'বাংলাদেশ-চীন শিক্ষা ডেটা ও খরচ রিপোর্ট', href: '/china-study-report-bangladesh', lang: 'en' },
  { label: 'চীনা বিশ্ববিদ্যালয় ডিরেক্টরি', href: '/china-universities', lang: 'en' },
  { label: 'ইনটেক ও আবেদনের শেষ তারিখ', href: '/china-intakes-deadlines', lang: 'en' },
  { label: 'চীনে স্কলারশিপ তুলনা গাইড', href: '/china-scholarships-bangladesh', lang: 'en' },
  { label: 'CSCA ভর্তি পরীক্ষার গাইড', href: '/updates/csca-guide-study-in-china', lang: 'en' },
  { label: 'চায়না K-Visa (STEM গ্র্যাজুয়েট)', href: '/updates/china-k-visa', lang: 'en' },
];

interface BnChinaRelatedGuidesProps {
  currentPath: string;
  englishTwin?: { label: string; href: string };
  ariaLabel?: string;
  tone?: 'white' | 'sage';
}

/** Shared cross-link grid for Bengali China guides, keeping 12 unique balanced cards without self-links. */
export default function BnChinaRelatedGuides({
  currentPath,
  englishTwin,
  ariaLabel = 'সম্পর্কিত বাংলা ও ইংরেজি চায়না গাইড',
  tone = 'sage',
}: BnChinaRelatedGuidesProps) {
  const seen = new Set<string>([currentPath]);
  const links: BnChinaGuideLink[] = [];

  if (englishTwin && !seen.has(englishTwin.href)) {
    seen.add(englishTwin.href);
    links.push({ label: englishTwin.label, href: englishTwin.href, lang: 'en' });
  }

  for (const item of BN_CHINA_GUIDE_LINKS) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    links.push(item);
  }

  const cardBg = tone === 'sage' ? 'bg-white' : 'bg-canvas-soft';

  return (
    <Section tone={tone} title="চীনে উচ্চশিক্ষার অন্যান্য বাংলা ও ইংরেজি গাইড">
      <nav aria-label={ariaLabel}>
        <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                hrefLang={item.lang}
                className={`flex h-full min-h-[64px] items-center justify-between gap-4 rounded-3xl ${cardBg} px-5 py-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale`}
              >
                <span>{item.label}</span>
                <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}

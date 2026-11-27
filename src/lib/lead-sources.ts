export type LeadSourceCategory = 'paid' | 'organic' | 'whatsapp' | 'in_house' | 'b2b';

export interface LeadSourceCategoryDef {
  key: LeadSourceCategory;
  label: string;
  shortLabel: string;
  tone: 'violet' | 'emerald' | 'teal' | 'slate' | 'indigo';
  badgeClass: string;
  dotColor: string;
}

export const LEAD_SOURCE_CATEGORIES: readonly LeadSourceCategoryDef[] = [
  {
    key: 'paid',
    label: 'Paid Ads (Meta / PPC)',
    shortLabel: 'Paid Ads',
    tone: 'violet',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    dotColor: '#9333ea',
  },
  {
    key: 'organic',
    label: 'Organic (Website / SEO)',
    shortLabel: 'Organic Web',
    tone: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: '#059669',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp Inbound',
    shortLabel: 'WhatsApp',
    tone: 'teal',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotColor: '#0d9488',
  },
  {
    key: 'in_house',
    label: 'In-House (Office / Walk-in)',
    shortLabel: 'In-House',
    tone: 'slate',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    dotColor: '#475569',
  },
  {
    key: 'b2b',
    label: 'Partner Network (B2B)',
    shortLabel: 'B2B Partner',
    tone: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dotColor: '#4f46e5',
  },
] as const;

export const STANDARD_SOURCE_OPTIONS = [
  { value: 'meta_ads', label: 'Meta Ads (Facebook / Instagram)', category: 'paid' },
  { value: 'website_organic', label: 'Website (Direct / SEO / Assessment)', category: 'organic' },
  { value: 'whatsapp_direct', label: 'WhatsApp Inbound', category: 'whatsapp' },
  { value: 'office_walkin', label: 'Office Walk-in (Dhanmondi)', category: 'in_house' },
  { value: 'in_house', label: 'In-House / Direct Entry', category: 'in_house' },
  { value: 'b2b_agent', label: 'Partner Agent / Sub-agent (B2B)', category: 'b2b' },
  { value: 'referral', label: 'Student / Personal Referral', category: 'in_house' },
] as const;

export function categorizeLeadSource(
  source?: string | null,
  utm?: unknown,
  channelType?: string | null,
): LeadSourceCategory {
  if (channelType?.toUpperCase() === 'B2B') return 'b2b';

  const s = (source || '').trim().toLowerCase();

  // 1. Explicit B2B
  if (s === 'b2b' || s === 'agent' || s === 'b2b_agent' || s.startsWith('b2b_') || s.includes('partner')) {
    return 'b2b';
  }

  // 2. WhatsApp
  if (s.includes('whatsapp') || s.includes('wa_') || s === 'wa') {
    return 'whatsapp';
  }

  // 3. In-House / Walk-in
  if (
    s === 'in-house' ||
    s === 'in_house' ||
    s === 'walkin' ||
    s === 'walk_in' ||
    s === 'office_walkin' ||
    s === 'office_visit' ||
    s === 'manual' ||
    s === 'referral'
  ) {
    return 'in_house';
  }

  // 4. Paid signals (Meta Ads, Google Ads, PPC, UTM campaign)
  if (
    s.includes('meta') ||
    s.includes('facebook') ||
    s.includes('instagram') ||
    s.includes('cpc') ||
    s.includes('ad_') ||
    s.includes('ads') ||
    s.includes('weblead') ||
    s.includes('campaign')
  ) {
    return 'paid';
  }

  // Check UTM if string or object
  if (utm) {
    let utmStr = '';
    if (typeof utm === 'string') {
      utmStr = utm.toLowerCase();
    } else if (typeof utm === 'object') {
      utmStr = JSON.stringify(utm).toLowerCase();
    }
    if (
      utmStr.includes('meta') ||
      utmStr.includes('facebook') ||
      utmStr.includes('cpc') ||
      utmStr.includes('paid') ||
      utmStr.includes('fbclid')
    ) {
      return 'paid';
    }
  }

  // 5. Organic website signals
  if (
    s.includes('page') ||
    s.includes('modal') ||
    s.includes('assessment') ||
    s.includes('website') ||
    s.includes('organic') ||
    s.includes('seo') ||
    s.includes('google')
  ) {
    return 'organic';
  }

  // Fallback defaults
  if (!s) return 'organic';
  return 'organic';
}

export function getSourceCategoryDef(category: LeadSourceCategory): LeadSourceCategoryDef {
  return (
    LEAD_SOURCE_CATEGORIES.find((c) => c.key === category) || LEAD_SOURCE_CATEGORIES[1]
  );
}

export function formatFriendlySource(source?: string | null, category?: LeadSourceCategory): string {
  if (!source) return 'Website Organic';
  const s = source.trim();

  // If already clean standard key
  if (s === 'meta_china_march_2027') return 'Meta Ads (China March 2027)';
  if (s === 'quick_contact_modal') return 'Quick Contact Modal';
  if (s === 'contact_page') return 'Contact Page Form';
  if (s === 'homepage_quick_assessment') return 'Homepage Quick Assessment';
  if (s.startsWith('university_page_')) {
    const uni = s.replace('university_page_', '').replace(/_/g, ' ');
    return `Uni Page: ${uni.slice(0, 30)}`;
  }
  if (s === 'In-House' || s === 'in_house') return 'In-House Direct';
  if (s === 'B2B' || s === 'b2b_agent') return 'B2B Partner';
  if (s === 'office_walkin') return 'Office Walk-in';
  if (s === 'whatsapp_direct') return 'WhatsApp Inbound';

  // Capitalize snake_case or kebab-case
  return s
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

import type { LeadRecord } from './lead-workflow';

export type WaTemplateKey = 'initial' | 'documents' | 'office_visit' | 'portal_invite';

export interface WaTemplateMeta {
  key: WaTemplateKey;
  label: string;
  labelBn: string;
  description: string;
}

export const WA_TEMPLATE_OPTIONS: WaTemplateMeta[] = [
  {
    key: 'initial',
    label: 'Greeting (Initial)',
    labelBn: 'প্রাথমিক পরিচিতি',
    description: 'Personalized Bangladesh greeting mentioning degree & GPA',
  },
  {
    key: 'documents',
    label: 'Document Request',
    labelBn: 'ডকুমেন্ট তালিকা',
    description: 'Ask for SSC/HSC/Bachelor marksheet, certificate & passport copy',
  },
  {
    key: 'office_visit',
    label: 'Office Visit Invite',
    labelBn: 'অফিস ভিজিট আমন্ত্রণ',
    description: 'Invite student & guardian to Dhanmondi, Dhaka office',
  },
  {
    key: 'portal_invite',
    label: 'Tracking Portal Invite',
    labelBn: 'লাইভ ট্র্যাকিং পোর্টাল লিংক',
    description: 'Send live /track/[token] 6-step China tracking portal URL',
  },
];

/** Normalizes Bangladeshi and international phone numbers to clean WhatsApp digits. */
export function normalizeWhatsappDigits(phone?: string | null): string {
  const rawDigits = (phone || '').replace(/[^0-9]/g, '');
  if (!rawDigits) return '';
  const digits = /^88001[0-9]{9}$/.test(rawDigits)
    ? `880${rawDigits.slice(4)}`
    : /^1[3-9][0-9]{8}$/.test(rawDigits)
      ? `880${rawDigits}`
      : rawDigits;
  return digits.startsWith('00880')
    ? digits.slice(2)
    : /^01[0-9]{9}$/.test(digits)
      ? `88${digits}`
      : digits;
}

/** Builds an https://wa.me/ link with an optional pre-filled UTF-8 message. */
export function buildWhatsAppUrl(phone?: string | null, message?: string): string | null {
  const clean = normalizeWhatsappDigits(phone);
  if (!clean) return null;
  if (!message || !message.trim()) return `https://wa.me/${clean}`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Extracts a numeric GPA (0.00 - 5.00) from explicit float or Meta form text. */
export function parseNumericGpa(gpa?: number | null, resultsText?: string | null): number | null {
  if (typeof gpa === 'number' && Number.isFinite(gpa) && gpa > 0 && gpa <= 5.5) {
    return Number(gpa.toFixed(2));
  }
  const text = (resultsText || '').trim();
  if (!text) return null;
  const match = text.match(/([0-5](?:\.[0-9]{1,2})?)/);
  if (!match) return null;
  const parsed = Number.parseFloat(match[1]);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 5.5) return null;
  return Number(parsed.toFixed(2));
}

export function formatWaTemplateMessage(
  key: WaTemplateKey,
  lead: Pick<LeadRecord, 'name' | 'country' | 'destinationInterest' | 'assessAcademicLevel' | 'assessAcademicResults' | 'gpa' | 'degree'>,
  portalUrl?: string | null,
): string {
  const name = lead.name?.trim() || 'শিক্ষার্থী';
  const dest = lead.country?.trim() || lead.destinationInterest?.trim() || 'চায়না';
  const degree = lead.degree?.trim() || lead.assessAcademicLevel?.trim() || '';
  const parsedGpa = parseNumericGpa(lead.gpa, lead.assessAcademicResults);
  const gpaText = parsedGpa != null ? `${parsedGpa.toFixed(2)}` : (lead.assessAcademicResults?.trim() || '');
  const eduParts = [degree, gpaText ? `GPA: ${gpaText}` : ''].filter(Boolean);
  const eduInfo = eduParts.length ? ` (${eduParts.join(', ')})` : '';

  switch (key) {
    case 'initial':
      return `আসসালামু আলাইকুম ${name}, এডুএক্সপ্রেস ইন্টারন্যাশনাল (ধানমন্ডি, ঢাকা) থেকে কাউন্সেলিং টিম বলছি। আপনি ${dest}-এ উচ্চশিক্ষা ও স্কলারশিপের ব্যাপারে অনুসন্ধান করেছিলেন। আপনার প্রোফাইল${eduInfo} অনুযায়ী এডমিশন ও উপযুক্ত স্কলারশিপ সুযোগ নিয়ে বিস্তারিত আলোচনা করতে আমরা কি কথা বলতে পারি?`;
    case 'documents':
      return `আসসালামু আলাইকুম ${name}, এডুএক্সপ্রেস ইন্টারন্যাশনাল থেকে বলছি। ${dest}-এ আপনার কাঙ্ক্ষিত প্রোগ্রামের স্কলারশিপ অ্যাপ্লিকেশন রেডি করার জন্য অনুগ্রহ করে আপনার এসএসসি/এইচএসসি/অনার্সের সার্টিফিকেট, মার্কশিট ও পাসপোর্টের স্ক্যান কপি আমাদের হোয়াট্‌সঅ্যাপে পাঠান। ধন্যবাদ!`;
    case 'office_visit':
      return `আসসালামু আলাইকুম ${name}, এডুএক্সপ্রেস ইন্টারন্যাশনাল অফিসে আপনাকে স্বাগতম! আপনার প্রোফাইল মূল্যায়ন ও ভিসা প্রসেসিং নিয়ে সরাসরি অভিজ্ঞ কাউন্সেলরের সাথে পরামর্শ করতে আমাদের ধানমন্ডি অফিসে আমন্ত্রণ জানাচ্ছি। ঠিকানা: হাউস ৫৪ (ফ্ল্যাট এ-১), রোড ১৫/এ, ধানমন্ডি, ঢাকা-১২০৯।`;
    case 'portal_invite': {
      const link = portalUrl || 'https://eduexpressint.com';
      return `আসসালামু আলাইকুম ${name}, এডুএক্সপ্রেস ইন্টারন্যাশনাল-এ আপনার ${dest} উচ্চশিক্ষা ও স্কলারশিপ ফাইল প্রসেসিং শুরু হয়েছে। আপনার ফাইলের লাইভ অগ্রগতি (Application Submitted ➔ University Review ➔ Admission Notice ➔ JW202/DQ Permit ➔ Embassy Visa ➔ Flight to China) ঘরে বসেই ট্র্যাক করতে এই সিকিউর পোর্টালটি ব্যবহার করুন:\n\n🔗 ${link}\n\nযেকোনো তথ্যের জন্য আমাদের কাউন্সেলিং টিম সর্বদা আপনার পাশে রয়েছে। ধন্যবাদ!`;
    }
  }
}

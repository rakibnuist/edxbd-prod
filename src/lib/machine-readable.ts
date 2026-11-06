import { chinaGuidePages } from '@/data/chinaGuidePages';
import { evidencePages } from '@/data/evidencePages';
import { getChinaIntakes } from '@/lib/china-intakes';
import { getPublishedUpdates } from '@/lib/content-records';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getIndexableUniversityGuides } from '@/lib/university-guide-publication';
import { getUniversityRecords } from '@/lib/university-records';

/**
 * Plain-text knowledge files for AI answer engines and buying agents
 * (/llms-full.txt, /pricing.md). Every line is generated from the same data the
 * site renders — no separate copy to drift — and dated so a reader can judge
 * freshness. Nothing here may state a fact the site itself does not state.
 */

const SITE = 'https://eduexpressint.com';
const url = (path: string) => `${SITE}${path}`;
const today = () => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date());
const clean = (value?: string | null) => (value ?? '').replace(/\s+/g, ' ').trim();
const UNPRICED = /not recorded|contact|request|not specified|not confirmed|unknown/i;

async function loadOffice() {
  try {
    const { offices } = await getPublicTrustRecords();
    return offices.find(item => item.isHeadOffice) ?? offices[0] ?? null;
  } catch {
    return null;
  }
}

async function loadPackages() {
  try {
    return (await getPublicTrustRecords()).servicePackages;
  } catch {
    return [];
  }
}

function companyBlock(office: Awaited<ReturnType<typeof loadOffice>>) {
  const phones = [office?.phonePrimary, office?.phoneSecondary].filter(Boolean).join(', ');
  return [
    '## Company facts',
    '',
    '- Name: EduExpress International (EduExpress)',
    '- What it is: an evidence-first study abroad consultancy for students and families in Bangladesh.',
    '- Founded: 8 March 2018, by Abdullah Al Rakib (Founder and CEO), in Chinese university admissions; a China entity (Wuxi Haiying Culture and Art Consulting Co., Ltd.) was formed in 2019; the Bangladesh operation relaunched in 2023.',
    office?.address ? `- Office: ${clean(office.address)}` : '- Office: Dhanmondi, Dhaka, Bangladesh',
    office?.hours ? `- Opening hours: ${clean(office.hours)}` : '',
    phones ? `- Phone / WhatsApp: ${phones}` : '',
    office?.email ? `- Email: ${office.email}` : '',
    `- Website: ${SITE}`,
    '- Languages: English and Bengali (Bengali guide: ' + url('/bn/study-in-china') + ')',
    '',
  ].filter(line => line !== '').join('\n') + '\n';
}

const policyBlock = [
  '## Policies that never change',
  '',
  '- The first profile assessment is free and carries no obligation.',
  '- China: no EduExpress service fee is due before the student’s China visa is approved.',
  '- University tuition, deposits, embassy, medical, translation and courier costs are paid to those recipients and are listed in writing before payment.',
  '- Admission, scholarship, visa and employment outcomes are never guaranteed; the university and the authorities decide.',
  `- Fee policy: ${url('/fees-and-transparency')} · Visa-first policy: ${url('/china-visa-first-policy')} · Complaints: ${url('/complaints-and-resolution')}`,
  '',
].join('\n') + '\n';

function intakeBlock() {
  const rows = getChinaIntakes();
  return [
    `## China intakes (status computed ${today()})`,
    '',
    ...rows.map(row => `- ${row.name}: ${row.status}. Applications open ${row.opensLabel}; university deadline ${row.deadlineLabel}; classes start ${row.classesStart}. ${clean(row.programs)}`),
    `- Details: ${url('/china-intakes-deadlines')}`,
    '',
  ].join('\n') + '\n';
}

function destinationBlock() {
  return [
    '## Destinations served',
    '',
    ...activeCountries.map(country => `- [Study in ${country.name}](${url(destinationPath(country.slug))}): ${clean(country.description)}`),
    '',
  ].join('\n') + '\n';
}

function guideBlock() {
  const out: string[] = ['## China guides (direct answers)', ''];
  for (const guide of Object.values(chinaGuidePages)) {
    out.push(`### ${guide.title}`, `URL: ${url(`/${guide.slug}`)}`, '', clean(guide.directAnswer), '');
    if (guide.facts.length) {
      out.push(...guide.facts.map(fact => `- ${fact.label}: ${fact.value}${fact.note ? ` (${clean(fact.note)})` : ''}`), '');
    }
    for (const faq of guide.faqs) out.push(`Q: ${clean(faq.question)}`, `A: ${clean(faq.answer)}`, '');
    if (guide.sources.length) out.push(`Official sources: ${guide.sources.map(source => source.href).join(' · ')}`, '');
  }
  return out.join('\n') + '\n';
}

function evidenceBlock() {
  return [
    '## How EduExpress works (policy pages)',
    '',
    ...Object.entries(evidencePages)
      .filter(([slug]) => !slug.includes('/'))
      .map(([slug, page]) => `- [${page.title}](${url(`/${slug}`)}): ${clean(page.description)}`),
    '',
  ].join('\n') + '\n';
}

async function universityBlock() {
  try {
    const [records, indexable] = await Promise.all([getUniversityRecords(), getIndexableUniversityGuides()]);
    const listed = records.filter(record => record.isActive || indexable.has(record.slug)).sort((a, b) => a.name.localeCompare(b.name));
    if (!listed.length) return '';
    return [
      `## University directory (${listed.length} public profiles)`,
      '',
      'Each profile lists programmes, fees, scholarships, intakes and the official source for each figure.',
      '',
      ...listed.map(record => {
        const tuition = clean(record.details.tuition);
        const awards = record.scholarships.filter(award => award.status !== 'closed').length;
        return `- [${record.name}](${url(`/universities/${record.slug}`)}), ${record.city}, ${record.country}` +
          (tuition && !UNPRICED.test(tuition) ? ` — tuition: ${tuition}` : '') +
          (record.programs.length ? ` — ${record.programs.length} programmes` : '') +
          (awards ? ` — ${awards} scholarship option${awards === 1 ? '' : 's'}` : '');
      }),
      `- Search all: ${url('/universities')}`,
      '',
    ].join('\n') + '\n';
  } catch {
    return '';
  }
}

async function updatesBlock() {
  try {
    const posts = await getPublishedUpdates(25, false);
    if (!posts.length) return '';
    const day = (value?: string) => (value ? new Date(value).toISOString().slice(0, 10) : '');
    return [
      `## Latest education updates (${posts.length} newest)`,
      '',
      'New universities, scholarships, programs and study tips, newest first. Each is dated; check the page for the current status.',
      '',
      ...posts.map(post => {
        const summary = clean(post.excerpt || post.metaDescription);
        const meta = [post.category, day(post.publishedAt ?? post.createdAt)].filter(Boolean).join(', ');
        return `- [${clean(post.title)}](${url(`/updates/${post.slug}`)})${meta ? ` (${meta})` : ''}${summary ? `: ${summary}` : ''}`;
      }),
      `- All updates: ${url('/updates')} · RSS: ${url('/updates/feed.xml')}`,
      '',
    ].join('\n') + '\n';
  } catch {
    return '';
  }
}

export async function buildLlmsFull(): Promise<string> {
  const [office, universities, updates] = await Promise.all([loadOffice(), universityBlock(), updatesBlock()]);
  return [
    '# EduExpress International — full reference for AI assistants',
    '',
    `> Evidence-first study abroad consultancy in Dhanmondi, Dhaka, Bangladesh (since 2018). Generated ${today()} from the live website data; the website is the source of truth.`,
    '',
    companyBlock(office),
    policyBlock,
    `Pricing summary: ${url('/pricing.md')}`,
    '',
    intakeBlock(),
    destinationBlock(),
    guideBlock(),
    universities,
    updates,
    evidenceBlock(),
    `## Contact`,
    '',
    `- Free assessment: ${url('/education-fit-assessment')}`,
    `- Contact and office visit: ${url('/contact')}`,
    '',
  ].join('\n').replace(/\n{3,}/g, '\n\n');
}

export async function buildPricing(): Promise<string> {
  const [office, packages] = await Promise.all([loadOffice(), loadPackages()]);
  const cost = chinaGuidePages['study-in-china-cost-bangladesh'];
  const thirdParty = cost?.sections.find(section => /third party/i.test(section.heading));
  const lines: string[] = [
    '# Pricing — EduExpress International',
    '',
    `> Study abroad service fees for students in Bangladesh. Generated ${today()} from the live website data. All amounts as published on ${url('/fees-and-transparency')}.`,
    '',
    '## Free profile assessment',
    '- Price: BDT 0',
    '- What you get: a counsellor reviews your results, budget and preferred country and explains realistic options, costs and documents.',
    `- Start: ${url('/education-fit-assessment')}`,
    '',
  ];
  for (const item of packages) {
    lines.push(
      `## ${item.title}`,
      `- Destination: ${item.destination}`,
      `- Price: ${item.priceLabel}`,
      `- Summary: ${clean(item.summary)}`,
      `- Payment terms: ${clean(item.paymentTerms)}`,
      `- Refund terms: ${clean(item.refundTerms)}`,
    );
    if (item.includedItems.length) lines.push('- Included:', ...item.includedItems.map(value => `  - ${clean(value)}`));
    if (item.excludedItems.length) lines.push('- Not included (paid separately):', ...item.excludedItems.map(value => `  - ${clean(value)}`));
    if (item.complianceNote) lines.push(`- Note: ${clean(item.complianceNote)}`);
    lines.push('');
  }
  if (thirdParty?.items?.length) {
    lines.push('## Third-party costs that may be due earlier', clean(thirdParty.summary), ...thirdParty.items.map(value => `- ${value}`), '');
  }
  lines.push(
    '## Rules',
    '- No EduExpress service fee before China visa approval.',
    '- Every cost is listed with item, amount, recipient, due date and refund status before payment.',
    '- No admission, scholarship or visa outcome is guaranteed.',
    '',
    '## Contact',
    office?.phonePrimary ? `- Phone / WhatsApp: ${office.phonePrimary}` : '',
    office?.address ? `- Office: ${clean(office.address)}` : '',
    `- ${url('/contact')}`,
    '',
  );
  return lines.filter((line, index, all) => !(line === '' && all[index - 1] === '')).join('\n');
}

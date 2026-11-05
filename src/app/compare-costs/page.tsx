import Link from 'next/link';
import { Suspense } from 'react';
import CostCompare from '@/components/finders/CostCompare';
import { CtaBand, FaqBlock, JsonLd, PageHero } from '@/components/page/PageKit';
import { toFeeRows, toProgramRows, type FeeRow } from '@/lib/catalog-views';
import { SITE_URL, ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

const PATH = '/compare-costs';
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Compare Study in China Costs Side by Side | EduExpress',
  description: 'Pick up to three China programs and compare tuition, accommodation, insurance, medical check, residence permit and application fees in one table.',
  path: PATH,
  image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
});

const faqs = [
  { question: 'Which costs does the comparison include?', answer: 'Tuition plus every first-year fee recorded for that university: accommodation, insurance, the medical check, the residence permit and the application fee. Where a figure is missing or unclear, the table says what to confirm with the university instead of guessing.' },
  { question: 'Why are amounts shown in CNY?', answer: 'Chinese universities publish fees in CNY. Exchange rates change daily, so you can enter today\'s BDT rate and the table converts every figure that has one explicit amount.' },
  { question: 'Is this the final amount I will pay?', answer: 'No. These are the latest recorded university figures, and universities can change fees between intakes. Before any payment, EduExpress gives you a written cost breakdown with each item, amount, recipient and due date.' },
];

async function load() {
  try {
    const universities = await getUniversityRecords('China');
    const fees: Record<string, FeeRow[]> = {};
    for (const university of universities) if (university.isActive) fees[university.slug] = toFeeRows(university);
    return { programs: toProgramRows(universities, new Date()), fees };
  } catch {
    return { programs: [], fees: {} };
  }
}

export default async function CompareCostsPage() {
  const { programs, fees } = await load();
  const url = `${SITE_URL}${PATH}`;

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Study in China cost comparison', url, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT' }, inLanguage: 'en-BD' }} />
      <PageHero
        path={PATH}
        trail={[{ name: 'Programs', path: '/programs' }, { name: 'Compare costs' }]}
        eyebrow="Compare before you commit"
        title="Compare first-year costs side by side"
        lead="Choose up to three programs. See tuition and every recorded first-year fee in one table, and where a figure is unclear, see exactly what to confirm with the university."
        actions={<Link href="/programs" className="ed-btn ed-btn-outline min-h-[54px] px-7">Browse all programs</Link>}
      />
      <Suspense fallback={<div className="bg-canvas-soft py-20 text-center text-[15px] text-ink-soft">Loading cost comparison…</div>}>
        <CostCompare programs={programs} fees={fees} />
      </Suspense>
      <FaqBlock items={faqs} title="About this comparison" tone="white" />
      <CtaBand title="Want the full cost in writing?" text="Send us the programs you are comparing. A counsellor confirms the current fees with each university and gives you a written breakdown before you pay anything." />
    </>
  );
}

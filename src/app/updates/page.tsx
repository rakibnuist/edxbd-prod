import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import UpdatesClient from './UpdatesClient';
import { chinaGuides } from './guides';
import { CtaBand, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { getPublishedUpdates } from '@/lib/content-records';
import { pageMetadata } from '@/lib/seo';
import type { Update } from '@/lib/types';

// PHASE 0 FIX: this page now fetches updates on the SERVER and passes them to
// the client component, so every article title/excerpt is present in the HTML
// for Google and AI crawlers (previously the HTML only said "Loading updates...").
// ISR: regenerated at most every 5 minutes.
export const revalidate = 300;

const PATH = '/updates';

const normalizeList = (values: unknown[]) =>
  Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

async function getUpdates(): Promise<{ updates: Update[]; categories: string[]; loaded: boolean }> {
  try {
    const updates = await getPublishedUpdates();
    const singleCategories = updates
      .map(u => u.category)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');
    const multiCategories = updates
      .map(u => u.categories || [])
      .flat()
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');

    return {
      updates,
      categories: normalizeList([...singleCategories, ...multiCategories]),
      loaded: true,
    };
  } catch (error) {
    console.error('Error fetching updates server-side:', error);
    // Fall back to empty — the client component will fetch from the API instead
    return { updates: [], categories: [], loaded: false };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { updates, loaded } = await getUpdates();
  const base = pageMetadata({
    title: 'Education Updates and Study Abroad News | EduExpress',
    description:
      'New universities, scholarships, programs and study tips for Bangladeshi students, plus intake windows and visa guidance. Every update is dated and sourced.',
    path: PATH,
    // An empty archive is a thin page: keep it out of the index until the first
    // update is published. A failed read is not treated as empty.
    noindex: loaded && updates.length === 0,
  });
  return {
    ...base,
    authors: [{ name: 'EduExpress International' }],
    creator: 'EduExpress International',
    publisher: 'EduExpress International',
    alternates: base.alternates,
    other: {
      'geo.region': 'BD-DH',
      'geo.placename': 'Dhaka',
      'geo.position': '23.8103;90.4125',
      'ICBM': '23.8103, 90.4125',
    },
  };
}

export default async function UpdatesPage() {
  const { updates, categories } = await getUpdates();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://eduexpressint.com/updates#blog',
    url: 'https://eduexpressint.com/updates',
    name: 'EduExpress Updates',
    description: 'Dated study-abroad updates, intake news and guidance for Bangladeshi students.',
    inLanguage: 'en-BD',
    publisher: { '@id': 'https://eduexpressint.com/#organization' },
    breadcrumb: { '@id': 'https://eduexpressint.com/updates#breadcrumb' },
    blogPost: updates.slice(0, 20).map((u) => ({
      '@type': 'BlogPosting',
      headline: u.title,
      url: `https://eduexpressint.com/updates/${u.slug}`,
      datePublished: u.publishedAt || u.createdAt,
    })),
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Updates' }]}
        eyebrow="Education updates"
        title="New universities, scholarships and study tips."
        lead="What changed this intake, new programs and scholarships, and practical advice from our counsellors. Every update shows when it was published and who wrote it, and old intake notices stay online, visibly closed."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get my free assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">Study in China guide</Link>
          </>
        }
        aside={
          // With nothing published the library itself lists these guides, so the
          // hero only repeats them once there are updates to browse.
          updates.length > 0 ? (
            <nav aria-label="Check before you apply" className={kit.card}>
              <p className="text-[15px] font-semibold text-ink-soft">Check before you apply</p>
              <ul className="mt-3 grid">
                {chinaGuides.map(guide => (
                  <li key={guide.href} className="border-t border-canvas-soft first:border-t-0">
                    <Link href={guide.href} className="group flex min-h-[64px] items-center justify-between gap-4 py-3">
                      <span>
                        <span className="block text-[14px] text-ink-soft">{guide.label}</span>
                        <span className="block text-[17px] font-semibold leading-snug text-petrol-800 group-hover:underline">{guide.title}</span>
                      </span>
                      <ArrowUpRight size={18} className="shrink-0 text-petrol-800" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : undefined
        }
      />

      <Section id="library">
        <UpdatesClient initialUpdates={updates} initialCategories={categories} />
      </Section>

      <CtaBand
        title="Need an answer for your intake?"
        text="Published deadlines and criteria can change. Tell us your results, budget and preferred intake, and a counsellor will check the current route directly."
      />
    </>
  );
}

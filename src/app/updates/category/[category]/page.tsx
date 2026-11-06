import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { chinaGuides } from '../../guides';
import { CtaBand, JsonLd, PageHero, Section } from '@/components/page/PageKit';
import { getPublishedUpdates } from '@/lib/content-records';
import { pageMetadata } from '@/lib/seo';
import UpdateCard from '@/components/updates/UpdateCard';
import { requestTime } from '@/lib/update-deadlines';
import { categorySlug, categoriesFromUpdate } from '@/lib/update-categories';

// Server-rendered category archive. Unlike the /updates list (client-side
// filter), these URLs exist per category so Google and AI crawlers can land
// directly on a topic. Visibility policy: every published, unexpired record
// renders here (currentVisibleContentWhere) — verified ones carry the
// verification stamp, others show the editorial-review note on their pages.
export const revalidate = 300;

type CategoryPageProps = { params: Promise<{ category: string }> };

async function getCategoryData(slug: string) {
  try {
    const posts = await getPublishedUpdates();
    const matched = posts.filter(post =>
      categoriesFromUpdate(post).some(label => categorySlug(label) === slug),
    );
    if (matched.length === 0) return null;
    const label = matched
      .flatMap(post => categoriesFromUpdate(post))
      .find(candidate => categorySlug(candidate) === slug) || slug;
    return { posts: matched, label };
  } catch {
    return null;
  }
}

/** Browser title within 45–60 characters whatever the label length. */
function categoryTitle(label: string) {
  const options = [
    `${label}: Study Abroad Updates and Guides | EduExpress`,
    `${label}: Study Abroad Updates | EduExpress`,
    `${label} Updates | EduExpress`,
  ];
  return options.find(option => option.length <= 60) ?? `${label.slice(0, 44)}… | EduExpress`;
}

/** Description within 160 characters whatever the label length. */
function categoryDescription(label: string) {
  const lower = label.toLowerCase();
  const options = [
    `Dated ${lower} posts from EduExpress International for Bangladeshi students: intake news, study guides and university announcements, with sources.`,
    `Dated ${lower} posts for Bangladeshi students: intake news, study guides and announcements from EduExpress, with sources.`,
  ];
  return options.find(option => option.length <= 160) ?? `${options[1].slice(0, 157)}…`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const slug = decodeURIComponent(category);
  const data = await getCategoryData(slug);

  if (!data) {
    return {
      title: 'Category not found',
      description: 'The requested update category could not be found.',
      robots: { index: false, follow: true },
    };
  }

  return pageMetadata({
    title: categoryTitle(data.label),
    description: categoryDescription(data.label),
    path: `/updates/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const slug = decodeURIComponent(category);
  const data = await getCategoryData(slug);

  if (!data) notFound();
  const { posts, label } = data;
  const path = `/updates/category/${slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: `https://eduexpressint.com${path}`,
    name: `EduExpress Updates — ${label}`,
    description: `Dated ${label.toLowerCase()} posts for Bangladeshi students.`,
    inLanguage: 'en-BD',
    publisher: { '@id': 'https://eduexpressint.com/#organization' },
    breadcrumb: { '@id': `https://eduexpressint.com${path}#breadcrumb` },
    blogPost: posts.slice(0, 20).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://eduexpressint.com/updates/${post.slug}`,
      datePublished: post.publishedAt || post.createdAt,
    })),
  };

  const now = requestTime();

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={path}
        trail={[{ name: 'Updates', path: '/updates' }, { name: label }]}
        eyebrow="Information centre"
        title={`${label}: updates and guides.`}
        lead={`${posts.length} ${label.toLowerCase()} post${posts.length === 1 ? '' : 's'} from EduExpress International. Every entry shows when it was published and who wrote it.`}
        actions={
          <>
            <Link href="/updates" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              All updates <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-outline min-h-[52px] px-7">Get my free assessment</Link>
          </>
        }
      />

      <Section>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((update, index) => (
            <li key={update.id}>
              <UpdateCard update={update} now={now} headingLevel="h2" priority={index < 3} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sage" title="Check before you apply." intro="The China guides cover intakes, scholarships, visas and complete costs.">
        <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {chinaGuides.map(guide => (
            <li key={guide.href}>
              <Link href={guide.href} className="group flex h-full min-h-[88px] items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 transition-colors hover:bg-lime-pale">
                <span>
                  <span className="block text-[14px] text-ink-soft">{guide.label}</span>
                  <span className="block text-[17px] font-semibold leading-snug text-petrol-800">{guide.title}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-petrol-800" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}

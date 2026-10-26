import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { getPublishedUpdates } from '@/lib/content-records';
import type { Update } from '@/lib/types';
import { categorySlug, categoriesFromUpdate } from '@/lib/update-categories';

// Server-rendered category archive. Unlike the /updates list (client-side
// filter), these URLs exist per category so Google and AI crawlers can land
// directly on a topic. Visibility policy: every published, unexpired record
// renders here (currentVisibleContentWhere) — verified ones carry the
// verification stamp, others show the editorial-review note on their pages.
export const revalidate = 300;

type CategoryPageProps = { params: Promise<{ category: string }> };

const fmtDate = (update: Update) => {
  const date = new Date(update.publishedAt || update.createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
};

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

  return {
    title: `${data.label} — Updates & Guides`,
    description: `Verified ${data.label.toLowerCase()} posts from EduExpress International: intake news, guides and university announcements for Bangladeshi students.`,
    robots: {
      index: true,
      follow: true,
      googleBot: { 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title: `${data.label} — Updates & Guides`,
      description: `Verified ${data.label.toLowerCase()} posts for Bangladeshi students.`,
      url: `/updates/category/${slug}`,
      type: 'website',
    },
    alternates: { canonical: `/updates/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const slug = decodeURIComponent(category);
  const data = await getCategoryData(slug);

  if (!data) notFound();
  const { posts, label } = data;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        url: `https://eduexpressint.com/updates/category/${slug}`,
        name: `EduExpress Updates — ${label}`,
        description: `Verified ${label.toLowerCase()} posts for Bangladeshi students.`,
        inLanguage: 'en-BD',
        publisher: { '@id': 'https://eduexpressint.com/#organization' },
        blogPost: posts.slice(0, 20).map(post => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: `https://eduexpressint.com/updates/${post.slug}`,
          datePublished: post.publishedAt || post.createdAt,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
          { '@type': 'ListItem', position: 2, name: 'Updates', item: 'https://eduexpressint.com/updates' },
          { '@type': 'ListItem', position: 3, name: label },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-[#08263c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PageHeader
        title="Updates by"
        highlight={label}
        description={`${posts.length} verified ${label.toLowerCase()} post${posts.length === 1 ? '' : 's'} from EduExpress International, each carrying checked dates and official sources.`}
        icon={<Sparkles />}
        badgeText="Information centre"
        breadcrumbs={[{ name: 'Updates', href: '/updates' }, { name: label }]}
      />

      <main className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(update => (
            <article key={update.id} className="group overflow-hidden rounded-[1.5rem] border border-[#174f7a]/12 bg-white shadow-[0_8px_28px_rgba(8,38,60,.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(8,38,60,.11)]">
              <Link href={`/updates/${update.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#08263c]">
                  {update.featuredImage
                    ? <Image src={update.featuredImage} alt={update.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                    : <div className="grid h-full place-items-center text-sm font-black uppercase tracking-[0.15em] text-[#9bd8f3]">EduExpress update</div>}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.13em] text-[#174f7a]">{update.category || update.categories?.[0] || 'Update'}</span>
                    <span className="shrink-0 rounded-full border border-[#174f7a]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">{update.type === 'article' ? 'Article' : 'Update'}</span>
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-xl font-extrabold leading-7 tracking-[-0.025em]">{update.title}</h2>
                  {update.excerpt ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{update.excerpt}</p> : null}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
                    <span className="truncate">{update.author}</span>
                    <span className="shrink-0">{fmtDate(update)}</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#174f7a]">{update.type === 'article' ? 'Read article' : 'Read update'} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

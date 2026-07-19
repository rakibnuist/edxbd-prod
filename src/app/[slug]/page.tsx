import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { evidencePages } from '@/data/evidencePages';
import ChinaCostCalculator from '@/components/china/ChinaCostCalculator';
import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(evidencePages)
    .filter((slug) => !slug.includes('/'))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = evidencePages[slug];
  const chinaGuide = chinaGuidePages[slug];
  if (!page) return {};
  if (chinaGuide) {
    return {
      title: { absolute: chinaGuide.metaTitle },
      description: chinaGuide.description,
      alternates: { canonical: `/${slug}` },
      openGraph: { title: chinaGuide.title, description: chinaGuide.description, url: `/${slug}`, type: 'website' },
    };
  }
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title: page.title, description: page.description, url: `/${slug}`, type: 'article' },
    ...(slug === 'study-in-china-from-bangladesh' ? { alternates: { canonical: `/${slug}`, languages: { en: `/${slug}`, bn: '/bn/study-in-china' } } } : {}),
  };
}

export default async function EvidencePageRoute({ params }: Props) {
  const { slug } = await params;
  const page = evidencePages[slug];
  if (!page) notFound();

  const chinaGuide = chinaGuidePages[slug];
  if (chinaGuide) return <ChinaGuidePage guide={chinaGuide} />;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: `https://eduexpressint.com/${slug}`,
    dateModified: page.reviewedAt,
    reviewedBy: { '@type': 'Organization', name: 'EduExpress International' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com' },
        { '@type': 'ListItem', position: 2, name: page.title, item: `https://eduexpressint.com/${slug}` },
      ],
    },
  };

  return (
    <article className="bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="bg-slate-950 px-4 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-300"><Link href="/">Home</Link> <span aria-hidden> / </span> {page.title}</nav>
          <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-amber-300">{page.eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>Last verified: {page.reviewedAt}</span><span aria-hidden>•</span><span>Next review: {page.nextReviewAt}</span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-4xl gap-6 px-4 py-16">
        {page.sections.map((section) => (
          <section key={section.heading} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold">{section.heading}</h2>
            <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{section.body}</p>
            {section.items && <ul className="mt-5 grid gap-3 text-slate-700">{section.items.map((item) => <li key={item} className="flex gap-3"><span className="text-emerald-600">✓</span><span>{item}</span></li>)}</ul>}
          </section>
        ))}
        {slug === 'study-in-china-cost-bangladesh' ? <ChinaCostCalculator /> : null}
        {page.sources?.length ? <section className="rounded-3xl border border-blue-200 bg-blue-50 p-7"><h2 className="text-xl font-bold">Official sources</h2><ul className="mt-4 grid gap-2">{page.sources.map((source) => <li key={source.href}><a className="text-blue-700 underline" href={source.href} rel="noreferrer" target="_blank">{source.label}</a> <span className="text-slate-500">(checked {page.reviewedAt})</span></li>)}</ul></section> : null}
        <aside className="rounded-3xl bg-blue-700 p-8 text-white md:p-10">
          <p className="font-semibold text-blue-100">Compare before you commit</p>
          <h2 className="mt-2 text-3xl font-bold">Get your free Education Fit Assessment</h2>
          <p className="mt-3 max-w-2xl text-blue-100">Share your academic profile, subject, budget, intake, language readiness and career goal. We’ll identify suitable routes, risks and missing information.</p>
          <Link href="/contact?service=education-fit-assessment" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-blue-800">Start my assessment</Link>
        </aside>
      </div>
    </article>
  );
}

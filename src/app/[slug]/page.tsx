import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { evidencePages } from '@/data/evidencePages';
import ChinaCostCalculator from '@/components/china/ChinaCostCalculator';
import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuidePages } from '@/data/chinaGuidePages';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const evidenceSlugs = Object.keys(evidencePages).filter((slug) => !slug.includes('/'));
  const chinaGuideSlugs = Object.keys(chinaGuidePages);
  
  return [...evidenceSlugs, ...chinaGuideSlugs].map((slug) => ({ slug }));
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
    <article className="bg-[#f4f8fa] text-[#08263c] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="relative overflow-hidden bg-[#08263c] px-5 pb-16 pt-28 text-white sm:px-8 sm:pb-20 sm:pt-36 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden> / </span> {page.title}
          </nav>
          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">{page.eyebrow}</p>
          <h1 className="max-w-4xl font-heading text-[clamp(2.2rem,4.8vw,4rem)] font-bold leading-[1.06] tracking-[-0.022em] text-white">{page.title}</h1>
          <p className="mt-6 max-w-3xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-white/75 md:text-lg md:leading-8">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
            <span>Last verified: {page.reviewedAt}</span><span aria-hidden>•</span><span>Next review: {page.nextReviewAt}</span>
          </div>
        </div>
      </header>
      
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-8 border-l border-t border-[#174f7a]/20">
          {page.sections.map((section, idx) => (
            <section key={section.heading} className="border-b border-r border-[#174f7a]/20 bg-white p-7 shadow-sm md:p-10">
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">
                <span>SECTION 0{idx + 1}</span>
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[#08263c] md:text-3xl">{section.heading}</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-700">{section.body}</p>
              {section.items && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 border border-[#174f7a]/15 bg-[#f4f8fa] p-4 text-xs font-semibold leading-5 text-[#08263c]">
                      <span className="font-bold text-[#174f7a]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {slug === 'study-in-china-cost-bangladesh' ? <ChinaCostCalculator /> : null}

          {page.sources?.length ? (
            <section className="border-b border-r border-[#174f7a]/20 bg-[#e9f7fd] p-7 md:p-10">
              <h2 className="font-heading text-xl font-bold text-[#08263c]">Official sources checked {page.reviewedAt}</h2>
              <ul className="mt-4 grid gap-3">
                {page.sources.map((source) => (
                  <li key={source.href}>
                    <a className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#174f7a] hover:underline" href={source.href} rel="noreferrer" target="_blank">
                      <span>{source.label}</span>
                      <span className="text-[10px] text-slate-500">(External Official Source)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <aside className="border-2 border-[#08263c] bg-[#08263c] p-8 text-white md:p-12">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#64b5df]">Compare before you commit</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">Get your free Education Fit Assessment</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">Share your academic profile, subject, budget, intake, language readiness and career goal. We’ll identify suitable routes, risks and missing information in writing.</p>
            <Link href="/contact?service=education-fit-assessment" className="mt-8 inline-flex items-center gap-3 bg-[#64b5df] px-6 py-4 text-sm font-black text-[#08263c] transition hover:bg-white">
              Start my assessment →
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}

'use client';

import { ArrowRight, Share2, Calendar, Clock, ChevronLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { trackConsultationRequest } from '@/lib/analytics';
import { UpdateClientProps } from '@/lib/types';
import { teamMembers } from '@/data/teamMembers';

// Deterministic date formatting (avoid locale-dependent server/client mismatch)
const fmtDate = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

export default function UpdateClient({ update, related = [], stale }: UpdateClientProps) {
  const teamMember = teamMembers.find(m => m.name.toLowerCase() === (update.author || '').trim().toLowerCase());
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: update.title,
          text: update.excerpt || update.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  // Smart title splitting for PageHeader
  const words = update.title.split(' ');
  const titlePart = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const highlightPart = words.slice(Math.ceil(words.length / 2)).join(' ');

  // Calculate read time
  const readTime = Math.max(1, Math.ceil((update.content.length || 0) / 1000)) + ' min read';

  // Posts older than ~12 months route readers to the live, verified intake
  // calendar instead of dead dates (computed server-side in page.tsx).
  const stalePost = stale?.enabled ?? false;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* 1. Standardized Header */}
      <PageHeader
        title={titlePart}
        highlight={highlightPart}
        description={update.excerpt || "Latest updates and opportunities from EduExpress International"}
        icon={Calendar}
        badgeText={update.category || "Update"}
      >
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            {readTime}
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            By {update.author}{teamMember ? ` · ${teamMember.role}` : ''}
          </div>
        </div>
      </PageHeader>

      <main className="relative z-10 -mt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link
              href="/updates"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all group bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Updates
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white/90 backdrop-blur-md border border-slate-200 hover:border-slate-300 transition-all hover:bg-slate-50 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* 2. Content Card */}
          <article className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden p-8 md:p-12 lg:p-16 mb-16 ring-1 ring-slate-100">

            {/* Wide Focus Image */}
            {update.featuredImage && (
              <div className="mb-12 -mx-8 md:-mx-12 lg:-mx-16 mt-[-2rem] md:mt-[-3rem] lg:mt-[-4rem] relative aspect-video shadow-sm border-b border-slate-100">
                <Image
                  src={update.featuredImage}
                  alt={update.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Content - Prose Slate (Dark text) */}
            <div className="update-content-fix prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-8 prose-p:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 prose-blockquote:text-slate-700 prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-strong:text-slate-900">
              <div dangerouslySetInnerHTML={{ __html: update.content }} />
            </div>

            {update.sourceUrls?.length ? (
              <aside className="mt-12 border-t border-slate-200 pt-8">
                <h2 className="text-xl font-bold text-slate-900">Official sources</h2>
                <div className="mt-4 grid gap-2">
                  {update.sourceUrls.map(source => (
                    <a key={source} href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
                      Official or institutional source <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </aside>
            ) : null}

            {/* Trust block — two tiers. Fully verified records show the stamp;
                everything else states plainly that editorial review is under
                way. This renders on every post (the visible-content policy). */}
            {update.lastVerifiedAt && update.nextReviewAt && update.reviewer && update.sourceUrls?.length ? (
              <aside className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-emerald-900">Content verification</h2>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-emerald-900/80">
                  {fmtDate(update.lastVerifiedAt) ? <>Verified on {fmtDate(update.lastVerifiedAt)}</> : 'Verification in progress'}
                  {update.reviewer ? <> · Content reviewed by {update.reviewer}</> : null}
                  {update.sourceUrls?.length ? <> · {update.sourceUrls.length} official source{update.sourceUrls.length === 1 ? '' : 's'} listed above</> : null}
                  {fmtDate(update.nextReviewAt) ? <> · Next scheduled review: {fmtDate(update.nextReviewAt)}</> : null}
                </p>
              </aside>
            ) : (
              <aside className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-amber-600" />
                  <h2 className="text-base font-bold text-amber-900">Editorial review in progress</h2>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-amber-900/80">
                  Verified dates, the named reviewer and the official source list for this post will appear here as the content is re-checked for the current admissions cycle.
                </p>
              </aside>
            )}

            {/* Stale-post care — old posts stay useful by pointing at the
                live, auto-verified intake calendar instead of dead dates. */}
            {stalePost ? (
              <aside className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-base font-bold text-slate-900">Intake dates change every cycle</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  This post was published on {fmtDate(update.publishedAt || update.createdAt)}. Before you act on any deadline shown, check the live application calendar — it carries the current 2026/27 windows and their verification dates.
                </p>
                <Link href="/china-intakes-deadlines" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#08263c] px-4 py-2 text-sm font-bold text-white">
                  Check intake deadlines <ArrowRight size={14} />
                </Link>
              </aside>
            ) : null}
          </article>

          {/* Related posts — interlinks the library by shared categories,
              every entry already passing the publication gate */}
          {related.length > 0 ? (
            <nav aria-label="Related posts" className="mb-12">
              <div className="flex items-end justify-between gap-4 mb-5 px-1">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-slate-900">Keep reading</h2>
                <Link href="/updates" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
                  All updates <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map(post => {
                  const postCategory = post.category || post.categories?.[0];
                  return (
                    <Link key={post.id} href={`/updates/${post.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                      <div className="relative aspect-[16/10] bg-slate-800">
                        {post.featuredImage
                          ? <Image src={post.featuredImage} alt={post.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                          : <div className="grid h-full place-items-center text-xs font-bold uppercase tracking-[0.15em] text-slate-300">EduExpress</div>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          {postCategory ? <span className="truncate text-xs font-bold uppercase tracking-[0.08em] text-amber-600">{postCategory}</span> : null}
                          <span className="shrink-0 text-xs font-semibold text-slate-400">{post.type === 'article' ? 'Article' : 'Update'}</span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-base font-bold text-slate-900">{post.title}</h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </nav>
          ) : null}

          {/* 6. High-Visibility Gradient CTA Banner */}
          <div className="bg-slate-900 rounded-[2rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden mb-12 group">

            <div className="absolute inset-0 bg-blue-900/20"></div>
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                Start your study abroad journey
              </h2>
              <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg/relaxed font-medium">
                Talk to a counsellor who reviews your profile, explains the real total costs and helps you choose the right route before you commit to anything.
              </p>

              <button
                onClick={() => {
                  trackConsultationRequest('update_footer_cta');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-slate-900 rounded-full font-bold text-lg transition-all shadow-lg shadow-amber-500/20 hover:bg-amber-400 hover:scale-105 active:scale-95 hover:shadow-amber-500/30"
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
